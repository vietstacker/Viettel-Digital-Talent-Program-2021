---


---

<h2 id="docker-overview">Docker overview</h2>
<p><img src="https://seekvectorlogo.com/wp-content/uploads/2018/12/docker-vector-logo.png" alt="enter image description here"></p>
<h3 id="what-and-why-docker-">1. What and why docker ?</h3>
<ul>
<li>Docker is an open platform for developing, shipping, and running applications.</li>
<li>Docker enable you to separate your applications from your infrastructure so you can deliver quickly. With Docker methodologies for shipping, testing and deploying code quickly, you can significantly reduce the delay between writing code and running it in production.</li>
</ul>
<h3 id="what-can-i-use-docker-for">2. What can I use Docker for?</h3>
<ul>
<li><em>Fast, consistent delivery of your applications</em>
<ul>
<li>Docker streamlines the development lifecycle by allowing developers to work in standardized env using local containers which provide your applications and services.</li>
</ul>
<blockquote>
<p>example: - You need update or fix bug your applications when your application in product env -&gt; if you use docker you just need to push your updated docker image to the production everything you need can be update and fix.</p>
</blockquote>
</li>
<li><em>Responsive deployment and scaling</em>
<ul>
<li>Docker’s container-based platform allows for highly portable workloads. Docker containers can run in local PC, Physical or VM in DC, on Cloud,…</li>
<li>Docker portability and lightweight also make easy to dynamically manage workloads, scaling up, tearing down applications and service as business</li>
</ul>
</li>
<li>
<h2 id="running-more-workloads-on-the-same-hardware"><em>Running more workloads on the same hardware</em></h2>
</li>
</ul>
<h3 id="docker-architecture">3. Docker architecture</h3>
<ul>
<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" checked="true" disabled=""> Docker uses a client-server architecture. The Docker <em>client</em> talks to the Docker <em>daemon</em>, which does the heavy lifting of building, running, and distributing your Docker containers .</li>
<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" checked="true" disabled=""> Docker client and daemon can run on the same system, or you can connect a Docker client to a remote Docker daemon.</li>
<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" checked="true" disabled=""> Docker client and daemon communicate using a restAPI, over network interface or UNIX sockets.</li>
<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" checked="true" disabled=""> <strong>Docker Compose</strong> is a Docker client. That lets you work with applications consisting of a set of containers.<br>
<img src="https://docs.docker.com/engine/images/architecture.svg" alt="enter image description here"></li>
</ul>
<h4 id="the-docker-daemon">3.1 - The Docker daemon</h4>
<ul>
<li>The Docker daemon (<code>dockerd</code>) listens for Docker API requests and manages Docker objects such as images, containers, networks, and volumes. A daemon can also communicate with other daemons to manage Docker services.</li>
</ul>
<h4 id="the-docker-client">3.2 - The Docker Client</h4>
<ul>
<li>Docker client (<code>docker</code>) is the primary way that many Docker users interact with Docker (by <strong>CLI or terminal</strong>). When you use commands such as <code>docker run</code>, the client sends these commands to <code>dockerd</code>, which carries them out. The <code>docker</code> command uses the Docker API. The Docker client can communicate with more than one daemon.</li>
</ul>
<h4 id="docker-registries">3.3 - Docker registries</h4>
<ul>
<li>Docker <em>registry</em> stores Docker images <em>(ex: Docker Hub is a public registry that anyone can use)</em>.</li>
<li>Docker is configured to look images on Docker Hub by default. (you can even run your own private registry)</li>
<li>When you use the <code>docker pull</code> or <code>docker run</code> commands, the required images are pulled from your configured registry. When you use the <code>docker push</code> command, your image is pushed to your configured registry.</li>
</ul>
<h4 id="docker-object">3.4 - Docker Object</h4>
<h5 id="images">3.4.1. Images</h5>
<ul>
<li>An <em>image</em> is a read-only template with instructor for creating a Docker container. Often, an image is <em>based on</em> another image, with some additional customization.</li>
</ul>
<blockquote>
<p>Example: you may build an image which based on <code>ubuntu</code> but installs Nginx webserver and your application.</p>
</blockquote>
<ul>
<li>You might create your own images or use those created by other and published in a registry.</li>
<li>To build your own image. Create <code>Dockerfile</code> with a simple syntax for defining steps needed to create the image and run it. Each instruction in  Dockerfile create a layer in the image. When you <em>change</em> the Dockerfile and rebuild the Image, <em><strong>only those layer which have changed are rebuild</strong></em> =&gt; this make images so lightweight, small and fast when compare to other virtualization technologies.</li>
</ul>
<h5 id="containers">3.4.2. Containers</h5>
<ul>
<li>A container is a runnable instance of an image.</li>
<li>You can create, start, stop, move, or delete a container using the Docker API or CLI. You can connect a container to one or more networks, attach storage to it, or even create a new image based on its current state.</li>
<li>By default, a container is relatively well isolated from other containers and its host machine. You can controls how isolated a container’s network, storage, or other underlying subsystems are from other container or from the host machine.</li>
<li>A container is defined by its image as well as any configuration option you provide to it when you create and start it. When a container is removed, any changes to its state that are not stored in persistent storage disappeared.</li>
</ul>

