This is a C++ object-recognition pipeline built from thresholding, segmentation, and region features. It represents objects through their shape rather than relying on a newly trained neural network.

Each frame is divided into regions, then described using invariant features or a projection into a smaller space of principal components. Matching happens in that feature space; a new object can be added from an example image.

The source and a recorded demonstration are available. The notes walk through the representations used in the pipeline.
