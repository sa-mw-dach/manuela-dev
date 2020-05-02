FROM registry.access.redhat.com/ubi8-minimal

RUN microdnf install -y yum && \
    microdnf -y clean all && \
    yum -y module enable httpd:2.4 && \
    yum install -y --setopt=tsflags=nodocs httpd && \
    rpm -V httpd && \
    yum -y clean all --enablerepo='*' && \ 
    sed -i 's/Listen 80/Listen 8080/' /opt/rh/httpd24/root/etc/httpd/conf/httpd.conf && \
    chgrp -R 0 /var/log/httpd24 /opt/rh/httpd24/root/var/run/httpd && \
    chmod -R g=u /var/log/httpd24 /opt/rh/httpd24/root/var/run/httpd

COPY rewrite.conf /etc/httpd/conf.d/

ENV HTTPD_CONTAINER_SCRIPTS_PATH=/usr/share/container-scripts/httpd/ \
    HTTPD_APP_ROOT=${APP_ROOT} \
    HTTPD_CONFIGURATION_PATH=${APP_ROOT}/etc/httpd.d \
    HTTPD_MAIN_CONF_PATH=/etc/httpd/conf \
    HTTPD_MAIN_CONF_MODULES_D_PATH=/etc/httpd/conf.modules.d \
    HTTPD_MAIN_CONF_D_PATH=/etc/httpd/conf.d \
    HTTPD_VAR_RUN=/var/run/httpd \
    HTTPD_DATA_PATH=/var/www \
    HTTPD_DATA_ORIG_PATH=/var/www \
    HTTPD_LOG_PATH=/var/log/httpd

EXPOSE 8080

USER 1001

CMD ["/usr/bin/run-httpd"]

#STOPSIGNAL SIGWINCH
#ENTRYPOINT ["/usr/sbin/httpd", "-D", "FOREGROUND"]