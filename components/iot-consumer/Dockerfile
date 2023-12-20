FROM registry.redhat.io/ubi7/nodejs-14

# Add application sources
ADD . /opt/app-root/src
# Install the dependencies
RUN npm install
# Expose Port
EXPOSE 3000
# Run script uses standard ways to run the application
CMD npm run -d start