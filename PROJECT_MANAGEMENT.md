# MANUela - Agile Projectmanagement

The core MANUela team decided to work on MANUela with an agile methodology, aligned to Scrum.

Scrum is a process framework that has been used to manage work on complex products since the early 1990s. Scrum is not a process, technique, or definitive method. Rather, it is a framework within which you can employ various processes and techniques. Scrum makes clear the relative efficacy of your product management and work techniques so that you can continuously improve the product, the team, and the working environment.

Please refer to the official [Scrum Guide](https://www.scrumguides.org/scrum-guide.html) to get more information about Scrum.

## MANUela - NEXT

A meeting to discuss new User Stories / Use Cases and the next steps of MANUela. It is also used to improve and refine the Product backlog.

Product Backlog refinement is the act of adding detail, estimates, and order to items in the Product Backlog. This is an ongoing process in which the Product Owner and the Development Team collaborate on the details of Product Backlog items. During Product Backlog refinement, items are reviewed and revised.

* On a monthly base
* Duration of 2-4 hours
* Should be conducted before a Sprint planning meeting.

## MANUela - Scrum Adaption

Scrum prescribes four formal events for inspection and adaptation, as described in the Scrum Events section of the [Scrum Guide](https://www.scrumguides.org/scrum-guide.html):

* Sprint Planning
* Daily Scrum
* Sprint Review
* Sprint Retrospective

### MANUela - Sprint Definition

> Here are the adjustments of Scrum for MANUela:

* The Sprint duration is one month.
* The Sprint duration is not negotiable.
* We always define a Sprint Goal.
* We select a team member for the role as Product Owner every Sprint.
* The Product Owner is accountable in termsof the Sprint Goal, the prioritization of tasks and User Stories

During the Sprint:

* No changes are made that would endanger the Sprint Goal; (i.e. no Tasks are added to the Sprint Backlog)
* Quality goals do not decrease; and,
* Scope may be clarified and re-negotiated between the Product Owner and Development Team as more is learned.

### MANUela - Sprint Planning

The work to be performed in the Sprint is planned at the Sprint Planning. This plan is created by the collaborative work of the entire Scrum Team.

* 2-4 hour meeting of the whole MANUela team
* It is held shortly after the Sprint Review and Sprint Retrospective of the previous Sprint.
* A new GitHub project is created every Sprint, which acts as the Sprint (Kanban) Board.
* A Sprint Goal is defined
* A team member is selected in the role of the Product Owner for this Sprint.
* The Team discusses User Stories and adds them from the Product Backlog to the Sprint Backlog.
* The Team defines the acceptance criteria (Definition of Done) for a User Story.
* The Team estimates the effort to implement a User Story.
* Every User Story has an owner assigned to it.
* The User Story owner breaks down the his User Stories into action items or tasks by creating Github Issues in the "To Do" column

> By the end of the Sprint Planning, the Team should be able to explain how it intends to work as a self-organizing team to accomplish the Sprint Goal and create the anticipated Increment.

### MANUela - Daily Scrum

The Daily Scrum is a 15-minute time-boxed event for the Development Team.
> The MANUela Daily Scrum is not held daily, instead it is held every monday and thursday at 8:45 AM in the week of a Sprint and participation is not mandatory.

### MANUela - Sprint Review

A Sprint Review is held at the end of the Sprint to inspect the Increment and adapt the Product Backlog if needed. During the Sprint Review, the Scrum Team and stakeholders collaborate about what was done in the Sprint.

* This is at most a four-hour meeting for one-month Sprints.

The Sprint Review includes the following elements:

* The Product Owner explains what Product Backlog items have been "Done" and what has not been "Done";
* The Team members demonstrate their work they have "Done" and answer questions about the Increment;
* Backlog items (Github Issues) which are "Done" are getting closed.
* Backlog items not "Done" move back to the Product Backlog and will be discussed.
* The Product Owner discusses the Product Backlog as it stands. He or she projects likely target and delivery dates based on progress to date (if needed);
* The entire group collaborates on what to do next, so that the Sprint Review provides valuable input to subsequent Sprint Planning;

### MANUela - Sprint Retrospective

The Sprint Retrospective is an opportunity for the Scrum Team to inspect itself and create a plan for improvements to be enacted during the next Sprint.

* The Sprint Retrospective occurs after the Sprint Review and prior to the next Sprint Planning.
* This is at most a three-hour meeting for one-month Sprints.
* The Team discusses what went well during the Sprint, what problems it ran into, and how those problems were solved;
* The Team documents the outcome as simple cards in the "Retrospective Learning" column in the main [GitHub Project](https://github.com/sa-mw-dach/manuela/projects/2)

The purpose of the Sprint Retrospective is to:

* Inspect how the last Sprint went with regards to people, relationships, process, and tools;
* Identify and order the major items that went well and potential improvements; and,
* Create a plan for implementing improvements to the way the Scrum Team does its work.

## MANUela - Scrum Tooling

We use [GitHub Projects](https://help.github.com/en/github/managing-your-work-on-github/about-project-boards) in the [MANUela GitHub repository](https://github.com/sa-mw-dach/manuela/projects) as the Product Backlog and Sprint Board.

### MANUela - Product Backlog

The Product Backlog is an ordered list of everything that is known to be needed in the product.
It is the single source of requirements for any changes to be made to the product.
The Product Owner is responsible for the Product Backlog, including its content, availability, and ordering.

* We use this [GitHub Project](https://github.com/sa-mw-dach/manuela/projects/2) as Product Backlog
* We only create **User Stories** in the Product Backlog.
* User Stories belong to epics and are normally labeled as such.
* User Stories are prioritized by the order from top (very important) to bottom (less important) of the "Backlog" column.
* We also collect Enhancements in this project.
* And the Sprint Retrospective Learnings are also documented as cards in the "Retrospective Learning" column.

### MANUela - Sprint Backlog

The Sprint Backlog is the set of Product Backlog items selected for the Sprint, plus a plan for delivering the product Increment and realizing the Sprint Goal. The Sprint Backlog is a forecast by the Development Team about what functionality will be in the next Increment and the work needed to deliver that functionality into a "Done" Increment.

* The Team selects the User Stories to implement during the Sprint from the [Product Backlog](https://github.com/sa-mw-dach/manuela/projects/2) and adds them to the Sprint Backlog.
* This is done at the beginning of the Sprint Planning.

### MANUela - Sprint Board

The MANUela Sprint Board (basically a Kanban board) has the following columns:

* **Sprint Backlog**: Contains the User Stories to implement during the Sprint. Prioritized by the order from top to bottom. Every User Story has an assigned owner.
* **To Do**: Tasks to implement / complete during the Sprint. Tasks are the unit of work. Tasks are normally not assigned to a team member at this stage.
* **In Progress**: Tasks a team member is assigned and currently working on.
* **HelpWanted**: Tasks that can not be continued for any reason. Help is needed. Labels indicate which type of help is needed (see below).
* **Done**: 
Task OPEN completed: Not reviewed during the Sprint Review, and the acceptance criteria is not evaluated.
Task CLOSED: Tasks completed and reviewed/discussed with the team. The acceptance criteria were met.

Labels: 
- HelpWanted: Comment
- HelpWanted: Review
- HelpWanted

#### Review of Tasks
When you completed the work, please decide if this is minor trivial change, then close the ticket into done.
If the work is a bit more complex, bigger change, we try to follow the four eyes principle to have minimum quality assurance.

#### Review of Sprint
Check of user stories, if they are completed (matched against success criteries)
Tasks are 




#### Sprint Board - Workflow

1. A team member picks a Task he or she wants to implement from the "To Do" column by assigning him or herself and moving the Task to "In Progress". 
2. The team member is working on the Task.
   1. Alternative: The work on this Task can not be continued for any reason. There is a Blocker for this Task. The team member moves the Task to "Blocked" and asks the team members for help.
   2. After removing the Blocker, the work can be continued. The Task is moved back to "In Progress".
3. The work on the Task is completed.
   1. Optional: The team member wants the Task to be reviewed. The details of what and how to review is documented in the comments of the task (GitHub Issue). After a successful review, by commenting the Task by the reviewer, -> 4. 
   2. Optional: Request for comments
4. The team member moves the Task to "Done" but does not close it.

5. When a ticket is closed, please document Why. e.g. when performing a review "add a LGTM -> Close", or "Sprint Review Meeting: consens story is complete and done -> close".



* According to the Kanban value WIP (Work in Progress), there should be only one Task per user at a time "In Progress". Limitting the WIP is important.
