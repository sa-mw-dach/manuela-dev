# Manuela-dev Pipelines

This repository contains a catalog of `Task`s, `Pipeline`s and other Tekton `Resource`s, which are designed to build the ManuELA software components.

## Task Kinds

There are two kinds of `Task`s:

 1. `ClusterTask` with a Cluster scope, which can be installed by a cluster
    operator and made available to users in all namespaces
 2. `Task` with a Namespace scope, which is designed to be installed and used
    only within that namespace.

`Task`s in this repo are namespace-scoped `Task`s, but can be installed as
`ClusterTask`s by changing the `kind`.

## Tasks Overview

### `bumpversion`
Increments the build number of a software component and commits and pushes the new version to the git repo
### `skopeo-tag-image`
Uses skopeo to tag an image in an image repository
### `gitops-imagetag`
Uses a Git repo as input, patches a yaml file, and pushes the changes.
### `argocd-task-sync-and-wait`
Logs in to an ArgoCD server and syncs an application
### `mock`
Just printing a string
### `skopeo-copy`
Uses skopeo to copy an image from one image repository to another
### `github-add-comment`
Used to comment a GitHub issue

## Pipelines Overview

### `iot-consumer-pipeline`
text...
### `iot-frontend-pipeline`
text...
### `iot-sensor-pipeline`
text...

## Installation

First, install the `OpenShift Pipelines Operator` onto your cluster:

.....




## Contributing and Support

If you want to contribute to this repository, please see our [contributing](./CONTRIBUTING.md) guidelines.

If you are looking for support, please enter an [issue](https://github.com/stefan-bergstein/manuela-dev/issues/new)

## Status of the Project

This project is still under active development, so you might run into
[issues](https://github.com/stefan-bergstein/manuela-dev/issues). If you do,
please don't be shy about letting us know.