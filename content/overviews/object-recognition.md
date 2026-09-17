This project is a C++ and OpenCV object-recognition pipeline that identifies items by their shape rather than relying on a neural network. Built entirely on classical computer vision techniques, the system utilizes thresholding, segmentation, and region features to extract geometric profiles.

The pipeline processes each video frame by dividing it into distinct regions. Each region is then classified two ways: a baseline matcher compares seven rotation- and scale-invariant geometric features, while an eigenspace matcher flattens the region to 4,096 pixels and projects it down to 20 principal components. Because matching occurs directly within these feature spaces, new objects can be dynamically registered and recognized from a single example image without any model retraining.

Both classifiers run on the same frames, and a built-in confusion matrix compares them side by side. There is no timing code in the pipeline, so it carries no frame-rate claim.
