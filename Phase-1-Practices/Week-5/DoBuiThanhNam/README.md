# WEEK 5: CI/CD, Microservice

## Practice: Setup Jenkins and CI/CD example

### Step 1: Installing Java 

Jenkins is a Java application and requires Java 8 or later to be installed on the system. We’ll install OpenJDK 11 , the open-source implementation of the Java Platform.
Run the following commands as root or user with sudo privileges or root to install OpenJDK 11:

```
$ sudo apt update

$ sudo apt install openjdk-11-jdk
```

Once the installation is complete, verify it by checking the Java version:

```
$ java -version
```

![img](https://github.com/namdbt00/Viettel-Digital-Talent-2021/blob/main/Week5/pic/Screenshot_6.png?raw=true)

The output should look something like this:


### Step 2: Installing Jenkins

Installing Jenkins on Ubuntu is relatively straightforward. We’ll enable the Jenkins APT repository, import the repository GPG key, and install the Jenkins package.

Import the GPG keys of the Jenkins repository using the following wget command:

```
$ wget -q -O - https://pkg.jenkins.io/debian/jenkins.io.key | sudo apt-key add -
```

Next, add the Jenkins repository to the system with:

```
$ sudo sh -c 'echo deb http://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
```

Once the Jenkins repository is enabled, update the apt package list and install the latest version of Jenkins by typing:

```
$ sudo apt update

$ sudo apt install jenkins
```

Jenkins service will automatically start after the installation process is complete. You can verify it by printing the service status:

```
$ sudo systemctl status jenkins
```

You should see something like this:

![img](https://github.com/namdbt00/Viettel-Digital-Talent-2021/blob/main/Week5/pic/Screenshot_7.png?raw=true)

### Step 3: Setting up Jenkins

To set up your new Jenkins installation, open your browser, type your domain or IP address followed by port 8080, http://localhost:8080/.

A page similar to the following will be displayed, prompting you to enter the Administrator password that is created during the installation:

![img](https://github.com/namdbt00/Viettel-Digital-Talent-2021/blob/main/Week5/pic/Screenshot_2.png?raw=true)


Use cat to display the password on the terminal:

```
$ sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

You should see a 32-character long alphanumeric password, as shown below:

![img](https://github.com/namdbt00/Viettel-Digital-Talent-2021/blob/main/Week5/pic/Screenshot_3.png?raw=true)

Customize Jenkins and you will see the result:

![img](https://github.com/namdbt00/Viettel-Digital-Talent-2021/blob/main/Week5/pic/Screenshot_10.png?raw=true)

### Step 4: Create Jenkins Pipeline

You must install some plugin: Docker pipeline, Git, Blue Ocean and install [Git](https://git-scm.com/)

![img](https://github.com/namdbt00/Viettel-Digital-Talent-2021/blob/main/Week5/pic/Screenshot_1.png?raw=true)

Create pipeline

[Here is my test project](https://github.com/namdbt00/tutorial-jenkins-pipeline)

![img](https://github.com/namdbt00/Viettel-Digital-Talent-2021/blob/main/Week5/pic/Screenshot_11.png?raw=true)

### Result

![img](https://github.com/namdbt00/Viettel-Digital-Talent-2021/blob/main/Week5/pic/Screenshot_14.jpg?raw=true)
