FROM quay.io/operator-framework/ansible-operator:v0.15.2

USER root
RUN dnf -y install openssh-clients && ansible-galaxy collection install pfsensible.core -p ${HOME}/collections/ansible_collections && chmod -R a+r ${HOME}/collections

USER 1001
COPY watches.yaml ${HOME}/watches.yaml
COPY roles/ ${HOME}/roles/
COPY playbook.yml ${HOME}/playbook.yml