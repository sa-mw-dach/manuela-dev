# Contributing to MANUela

First, thanks for taking the time to contribute!

The following is a set of guidelines for contributing to MANUela and its components, which are hosted in the [MANUela Organization](https://github.com/sa-mw-dach/manuela) and [MANUela Development](https://github.com/sa-mw-dach/manuela-dev) repositories on GitHub. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

#### Table Of Contents

[Code of Conduct](#code-of-conduct)

[I don't want to read this whole thing, I just have a question!!!](#i-dont-want-to-read-this-whole-thing-i-just-have-a-question)

[What should I know before I get started?](#what-should-i-know-before-i-get-started)
* [MANUela Components](#manuela-components)
* [MANUela Design Decisions and Concepts](#design-decisions-and-concepts)

[How Can I Contribute?](#how-can-i-contribute)
* [Reporting Bugs](#reporting-bugs)
* [Suggesting Enhancements](#suggesting-enhancements)
* [Pull Requests](#pull-requests)
* [Setup local development](#setup-local-development)

[Styleguides](#styleguides)
* [Git Commit Messages](#git-commit-messages)
* [Java Styleguide](#java-styleguide)
* [JavaScript Styleguide](#javascript-styleguide)
* [Documentation Styleguide](#documentation-styleguide)

## Code of Conduct

This project and everyone participating in it is governed by the [MANUela Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [manuela@redhat.com](mailto:manuela@redhat.com.com).

## I don't want to read this whole thing I just have a question!!

> **Note:** Please don't file an issue to ask a question.
You'll get faster results by using the resources below.

We have an official documentation at the [MANUela Organization](https://github.com/sa-mw-dach/manuela) repo with detailed instructions on how to use MANUela.

* [MANUela, current Sprint and working state](https://github.com/sa-mw-dach/manuela/projects)

If chat is more your speed, and you are from the Red Hat organization, you can join the MANUela team:

* [Join Red Hat MANUela Chat](https://chat.google.com/room/AAAAonnPp64)

## What should I know before I get started?

### MANUela Components

MANUela (MANUfacturing Edge Lightweight Accelerator) is an implementation of an IoT/Edge reference architecture with Red Hat technologies that can be customized to meet specific business requirements. The full code is open-source and available on the [MANUela Organization](https://github.com/sa-mw-dach/manuela) and [MANUela Development](https://github.com/sa-mw-dach/manuela-dev) GitHub repository. You can use it as a demo or as a starting point for a commercial product, and deploy a pre-built solution into your OpenSift environments in minutes. MANUela (MANUfacturing Edge Lightweight Accelerator) includes the following components/features:

* [components/iot-software-sensor](https://github.com/sa-mw-dach/manuela-dev/tree/master/components/iot-software-sensor) - A software simulated sensor, implemented with Spring Boot, and capabilities to simulate
  * vibration
  * temperature
  * light
  * GPS

  sensor data. You can configure each sensor type through the application.properties file. The sensor sends the metrics to a MQTT broker.

* [components/iot-software-sensor-quarkus](https://github.com/sa-mw-dach/manuela-dev/tree/master/components/iot-software-sensor-quarkus) - A software simulated sensor, implemented with Camel Quarkus, and capabilities to simulate
  * vibration
  * temperature
  * light
  * GPS

  sensor data. You can configure each sensor type through the application.properties file. The sensor sends the metrics to a MQTT broker.
* [components/iot-consumer](https://github.com/sa-mw-dach/manuela-dev/tree/master/components/iot-consumer) - A NodeJS application, consuming the metrics from the MQTT broker, and pushing this realtime data to the iot-frontend dashboard for visualization over a Websocket connection (with socket.io). Also features anomaly detection and alerting for thresholds.
* [components/iot-frontend](https://github.com/sa-mw-dach/manuela-dev/tree/master/components/iot-frontend) - A Single page application, implemented with Ionic/Angular, to visualize the sensor metrics in realtime, alerts etc. Connects via Websocket to the iot-consumer component.
* [components/iot-anomaly-detection](https://github.com/sa-mw-dach/manuela-dev/tree/master/components/iot-anomaly-detection) - 
* [Tekton](https://github.com/sa-mw-dach/manuela-dev/tree/master/tekton) - We use modern OpenShift Pipelines based on Tekton for building, testing and deploying the MANUela components.
* [Networkpath Operator](https://github.com/sa-mw-dach/manuela-dev/tree/master/networkpathoperator) - An Ansible operator implementation to configure Firewall configurations.

### Naming Conventions

#### Components

There are a few conventions that have developed over time around components:

* Components starts with `iot-[component-name]`

#### Git Branches

tbd.

#### Git Tags

tbd.

### Design Decisions and Concepts

When we make a significant decision in how we maintain the project and what we can or cannot support, we will document it in the [MANUela Concepts documentation](https://github.com/sa-mw-dach/manuela/blob/master/docs/concepts.md).

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for MANUela. Following these guidelines helps maintainers and the community understand your report.

Before creating bug reports, please check [this list](#before-submitting-a-bug-report) as you might find out that you don't need to create one. When you are creating a bug report, please [include as many details as possible](#how-do-i-submit-a-good-bug-report).

> **Note:** If you find a **Closed** issue that seems like it is the same thing that you're experiencing, open a new issue and include a link to the original issue in the body of your new one.

#### Before Submitting A Bug Report

* **Use the [MANUela Organization repository to create a bug](https://github.com/sa-mw-dach/manuela)**.
* **Perform a [search](https://github.com/sa-mw-dach/manuela/issues)** to see if the problem has already been reported. If it has **and the issue is still open**, add a comment to the existing issue instead of opening a new one.

#### How Do I Submit A (Good) Bug Report?

Bugs are tracked as [GitHub issues](https://guides.github.com/features/issues/).

Explain the problem and include additional details to help maintainers reproduce the problem:

* **Use a clear and descriptive title** for the issue to identify the problem.
* **Describe the exact steps which reproduce the problem** in as many details as possible.
* **Provide specific examples to demonstrate the steps**. Include links to files or GitHub projects, or copy/pasteable snippets, which you use in those examples. If you're providing snippets in the issue, use [Markdown code blocks](https://help.github.com/articles/markdown-basics/#multiple-lines).
* **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
* **Explain which behavior you expected to see instead and why.**
* **Include screenshots and animated GIFs** which show you following the described steps and clearly demonstrate the problem. 
* **If the problem is related to performance or memory**, include a CPU profile capture with your report.
* **If the problem wasn't triggered by a specific action**, describe what you were doing before the problem happened and share more information using the guidelines below.

Provide more context by answering these questions:

* **Did the problem start happening recently** (e.g. after updating to a new version) or was this always a problem?
* If the problem started happening recently, **can you reproduce the problem in an older version?**
* **Can you reliably reproduce the issue?** If not, provide details about how often the problem happens and under which conditions it normally happens.

Include details about your configuration and environment:

* **Which version of OpenShift you're using**?
* **Are you running CRC?** If so, which version are you using and which operating systems?
* **Which [components](#manuela-components) do you have installed?**.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for MANUela, including completely new features and minor improvements to existing functionality. Following these guidelines helps maintainers and the community understand your suggestion and find related suggestions.

Before creating enhancement suggestions, please check [this list](#before-submitting-an-enhancement-suggestion) as you might find out that you don't need to create one. When you are creating an enhancement suggestion, please [include as many details as possible](#how-do-i-submit-a-good-enhancement-suggestion).

#### Before Submitting An Enhancement Suggestion

* **Perform a [search](https://github.com/sa-mw-dach/manuela/issues)** to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.

#### How Do I Submit A (Good) Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://github.com/sa-mw-dach/manuela/issues). Create an issue on that repository and provide the following information:

* **Use a clear and descriptive title** for the issue to identify the suggestion.
* **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
* **Provide specific examples to demonstrate the steps**. Include copy/pasteable snippets which you use in those examples, as [Markdown code blocks](https://help.github.com/articles/markdown-basics/#multiple-lines).
* **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
* **Include screenshots and animated GIFs** which help you demonstrate the steps. You can use [this tool](https://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux.
* **List some other applications where this enhancement exists.**

### Pull Requests

1. To contribute, use GitHub Pull Requests, from your own fork.
2. Follow the [styleguides](#styleguides)

All submissions, including submissions by project members, need to be reviewed before being merged.

The reviewer(s) may ask you to complete additional design work, tests, or other changes before your pull request can be ultimately accepted.

### Setup local development

If you have not done so on this machine, you need to:

* Install Git and configure your GitHub access
* Install Java SDK (OpenJDK recommended)
* Install Maven
* [Install Node and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
* [Install Ionic Framework](https://ionicframework.com/docs/intro/cli)

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Start with the component / artefact you are commiting (`(iot-quarkus-sensor) Add new sensor`)
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line (`#issueNumber`)
* When only changing documentation, include `[ci skip]` in the commit title

### Java Styleguide

Please refer to the [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html), which is very well known and widely accepted.

### JavaScript Styleguide

All JavaScript must adhere to [JavaScript Standard Style](https://standardjs.com/).

* Prefer the object spread operator (`{...anotherObj}`) to `Object.assign()`
* Inline `export`s with expressions whenever possible
  ```js
  // Use this:
  export default class ClassName {

  }

  // Instead of:
  class ClassName {

  }
  export default ClassName
  ```
* Place requires in the following order:
    * Built in Node Modules (such as `path`)
    * Local Modules (using relative paths)
* Place class properties in the following order:
    * Class methods and properties (methods starting with `static`)
    * Instance methods and properties

### Documentation Styleguide

* Use [Markdown](https://daringfireball.net/projects/markdown).
* Reference methods and classes in markdown with the custom `{}` notation:
    * Reference classes with `{ClassName}`
    * Reference instance methods with `{ClassName::methodName}`
    * Reference class methods with `{ClassName.methodName}`
