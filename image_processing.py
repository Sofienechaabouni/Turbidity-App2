import cv2
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import skimage.feature as ft
from skimage.restoration import denoise_bilateral
from sklearn.cluster import DBSCAN
from skimage.feature import hog
from skimage import data, exposure
import joblib

def process_df(df):
    # Assuming df contains only one image
    def calculate_histogram(img):
    
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        hist_r = cv2.calcHist([img_rgb], [0], None, [8], [0, 256]).flatten()
        hist_g = cv2.calcHist([img_rgb], [1], None, [8], [0, 256]).flatten()
        hist_b = cv2.calcHist([img_rgb], [2], None, [8], [0, 256]).flatten()
        return np.concatenate([hist_r, hist_g, hist_b])
    # Compute histograms and store them in a list
    histograms = df['image'].apply(lambda x: calculate_histogram(x)).tolist()

    # Convert this list into a DataFrame
    hist_df = pd.DataFrame(histograms, columns=[f'hist_{i}' for i in range(24)])


    # Concatenate the original DataFrame with the new normalized histogram columns
    df = pd.concat([df.reset_index(drop=True), hist_df], axis=1)
    ####***************************
    def calculate_moments(img):
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # Compute mean and standard deviation for each channel
        mean_r, std_r = np.mean(img_rgb[:,:,0]), np.std(img_rgb[:,:,0])
        mean_g, std_g = np.mean(img_rgb[:,:,1]), np.std(img_rgb[:,:,1])
        mean_b, std_b = np.mean(img_rgb[:,:,2]), np.std(img_rgb[:,:,2])
        mean_all_channels = (mean_r + mean_g + mean_b) / 3.0
        std_all_channels = np.sqrt((std_r**2 + std_g**2 + std_b**2) / 3.0)
        return mean_r, std_r,mean_g, std_g,mean_b, std_b,mean_all_channels,std_all_channels

    df['mean_r'], df['std_r'], df['mean_g'], df['std_g'], df['mean_b'], df['std_b'], df['mean_all_channels'], df['std_all_channels'] = zip(*df['image'].apply(calculate_moments))
 
    #*************
    def extract_lbp_features(image):
        img_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        gray = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2GRAY)

        radius = 1
        n_points = 8 * radius
        lbp = ft.local_binary_pattern(gray, n_points, radius, method='uniform')
        hist, _ = np.histogram(lbp.ravel(), bins=np.arange(0, n_points + 3), range=(0, n_points + 2))

        # Normalize the histogram
        hist = hist.astype('float')
        hist /= hist.sum()

        return hist

    # Apply the extract_lbp_features function to each image in the DataFrame
    df['lbp_hist'] = df['image'].apply(extract_lbp_features)

    # Convert the 'lbp_hist' column into separate columns with custom names
    column_names = [f'lbp_hist{i}' for i in range(df['lbp_hist'][0].shape[0])]
    df[column_names] = pd.DataFrame(df['lbp_hist'].to_list(), columns=column_names)

    # Drop the original 'lbp_hist' column
    df = df.drop('lbp_hist', axis=1)
    # #********
    def extract_haralick(image):
        img_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        denoised_image = cv2.bilateralFilter(img_rgb, 9, 75, 75)
        gray = cv2.cvtColor(denoised_image, cv2.COLOR_RGB2GRAY)
        glcm = ft.graycomatrix(gray, distances=[1], angles=[0], symmetric=True, normed=True)

        contrast = ft.graycoprops(glcm, 'contrast')[0][0]
        energy = ft.graycoprops(glcm, 'energy')[0][0]
        homogeneity = ft.graycoprops(glcm, 'homogeneity')[0][0]
        dissimilarity = ft.graycoprops(glcm, 'dissimilarity')[0][0]
        correlation = ft.graycoprops(glcm, 'correlation')[0][0]
        asm = np.sum(glcm ** 2)

        # p_xplusy = np.zeros((2*256,))
        # for i in range(glcm.shape[0]):
        #     for j in range(glcm.shape[1]):
        #         p_xplusy[i+j] += glcm[i, j]
        # p_xplusy /= p_xplusy.sum()
        # sum_entropy = -1 * (p_xplusy * np.log(p_xplusy + np.finfo(float).eps)).sum()

        return contrast, energy, homogeneity, dissimilarity, correlation, asm

    # Apply the extract_haralick function to each image in the DataFrame
    df['contrast'], df['energy'], df['homogeneity'], df['dissimilarity'], df['correlation'], df['asm']= zip(*df['image'].apply(extract_haralick))

    
    # #************
    # Function to detect lines and calculate median coordinates per cluster
    def detect_lines(image):
        img_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        gray = cv2.cvtColor(img_rgb, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 50, 150, apertureSize=3)
        lines = cv2.HoughLines(edges, 1, np.pi/180, 100)

        if lines is not None:
            # Convert the lines from polar to Cartesian coordinates
            cartesian_lines = []
            for line in lines:
                rho, theta = line[0]
                a = np.cos(theta)
                b = np.sin(theta)
                x0 = a * rho
                y0 = b * rho
                x1 = int(x0 + 1000 * (-b))
                y1 = int(y0 + 1000 * (a))
                x2 = int(x0 - 1000 * (-b))
                y2 = int(y0 - 1000 * (a))
                cartesian_lines.append([x1, y1, x2, y2])

            # Apply DBSCAN for clustering
            dbscan = DBSCAN(eps=20, min_samples=2)
            labels = dbscan.fit_predict(cartesian_lines)
            num_clusters = len(set(labels)) - (1 if -1 in labels else 0)

            if num_clusters > 0:
                cluster_coordinates = []
                for cluster_id in range(num_clusters):
                    cluster_indices = np.where(labels == cluster_id)[0]  # Indices of points in current cluster
                    cluster_lines = np.array(cartesian_lines)[cluster_indices]
                    median_x = np.median(cluster_lines[:, [0, 2]])
                    median_y = np.median(cluster_lines[:, [1, 3]])
                    cluster_coordinates.append([median_x, median_y])
                return num_clusters, cluster_coordinates

        return 0, []

    # Loop over each row in the DataFrame and detect lines
    df['num_clusters'], df['line_coordinates'] = zip(*df['image'].apply(lambda x: detect_lines(x)))
    max_clusters = df['num_clusters'].max()  # Step 1: Get the maximum number of clusters
    x_columns = [f'X_cluster{i+1}' for i in range(max_clusters)]  # Step 2: Generate column names for X coordinates
    y_columns = [f'Y_cluster{i+1}' for i in range(max_clusters)]  # Step 2: Generate column names for Y coordinates

    # Create empty columns for X and Y coordinates
    df[x_columns] = pd.DataFrame([[np.nan] * max_clusters] * len(df), columns=x_columns)
    df[y_columns] = pd.DataFrame([[np.nan] * max_clusters] * len(df), columns=y_columns)

    # Loop over each row and assign cluster coordinates to respective columns
    for index, row in df.iterrows():
        num_clusters = row['num_clusters']
        if num_clusters > 0:
            cluster_coordinates = row['line_coordinates']
            for i in range(num_clusters):
                df.at[index, x_columns[i]] = cluster_coordinates[i][0]  # Assign X coordinate to respective column
                df.at[index, y_columns[i]] = cluster_coordinates[i][1]  # Assign Y coordinate to respective column

    # Print the modified DataFrame
    df.drop('line_coordinates', axis=1, inplace=True)
  
    
    # #*****************
    def detect_area(image):
        img_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        gray = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2GRAY)
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        areas = []
        for contour in contours:
            area = cv2.contourArea(contour)
            areas.append(area)

        areas = sorted(areas, reverse=True)[:10]
        return areas

    # Loop over each row in the dataframe, read the corresponding image
    for i in range(1, 11):
        column_name = 'area' + str(i)
        df[column_name] = np.nan

    for i, row in df.iterrows():
        areas = detect_area(row['image'])
        for j, area in enumerate(areas):
            column_name = 'area' + str(j + 1)
            df.at[i, column_name] = area


    # #**************
    def Hog_feat(image):
        # Convert the image to grayscale
        img_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        gray = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2GRAY)

        # Compute HOG features
        features, hog_image = hog(gray, orientations=8, pixels_per_cell=(16, 16),
                                cells_per_block=(1, 1), visualize=True, channel_axis=None)

        # Rescale the HOG image for better visualization
        hog_imag_rescaled= exposure.rescale_intensity(hog_image, in_range=(0, 10))

        return features

    # Loop over each row in the dataframe, read the corresponding image
    num_hog_features = 4  # Number of HOG features

    for i in range(1, num_hog_features + 1):
        column_name = 'HOG' + str(i)
        df[column_name] = [0] * len(df)

    for i, row in df.iterrows():
        hog_features = Hog_feat(row['image'])
        for j, feature in enumerate(hog_features[:num_hog_features]):
            column_name = 'HOG' + str(j + 1)
            df.at[i, column_name] = feature


    # print(df.tail)
    df = df.drop('name', axis=1)
    df=df.drop('image', axis=1)
    # # List of columns to keep
    columns_to_keep = ['hist_0', 'hist_2', 'hist_3', 'hist_4', 'hist_9', 'hist_10', 'hist_11',
       'hist_12', 'hist_16', 'hist_17', 'hist_18', 'hist_19', 'hist_20',
       'mean_r', 'std_r', 'std_g', 'std_b', 'std_all_channels', 'num_clusters',
       'area1']

    # Keep only the specified columns in the DataFrame
    df = df.loc[:, columns_to_keep]


    # print("Features without NaN values ***********************************")

    # # Get the column names without NaN values
    # columns_without_nan = [col for col in df.columns if df[col].isnull().sum() == 0]

    # # Print the column names without NaN values
    # print("Features without NaN values:")
    # for column in columns_without_nan:
    #     print(column)
    # Normalize the entire DataFrame using Min-Max scaling
    # Assuming df contains only one row
    columns_to_normalize = ['hist_0', 'hist_2', 'hist_3', 'hist_4', 'hist_9', 'hist_10', 'hist_11',
       'hist_12', 'hist_16', 'hist_17', 'hist_18', 'hist_19', 'hist_20',
       'mean_r', 'std_r', 'std_g', 'std_b', 'std_all_channels', 'num_clusters',
       'area1']
    #scaler = MinMaxScaler()
    #df[columns_to_normalize] = scaler.fit_transform(df[columns_to_normalize])
    #loaded_model = joblib.load(r'C:\Users\sofie\OneDrive\Bureau\turbidity-app-master\chi2_model.pkl', check_version=False)
    #predictions = loaded_model.predict(df)
    loaded_model = joblib.load('C:\\Users\\sofie\\OneDrive\\Bureau\\turbidity-app-master\\chi2_model.pkl')

    #print(predictions)
    print(df.tail)
    print(df.shape)

    
    

