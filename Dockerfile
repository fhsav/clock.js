FROM ubuntu

# Install Node.js
RUN apt-get install -y software-properties-common
RUN add-apt-repository -y ppa:chris-lea/node.js
RUN apt-get update
RUN apt-get install -y nodejs

# Append to $PATH variable.
RUN echo '\n# Node.js\nexport PATH="node_modules/.bin:$PATH"' >> /root/.bash_profile

# Define default command.
CMD ["node"]

# Install Git
RUN apt-get install -y git

# Download and run clock.js
RUN git clone https://github.com/gluxon/clock.js
RUN cd clock.js
RUN npm install
RUN node clock.js
