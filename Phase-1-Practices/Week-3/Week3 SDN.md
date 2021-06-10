# VTnet-Training-Week-3


## Install OVS 


Installing OpenVswitch (virtual switch) via apt:

`sudo apt install openvswitch-switch`

and run 
`sudo ovs-vsctl --version `

to check

and Show routing table:

$` route -n`



![183895265_515616019616250_4911126515570353022_n](https://user-images.githubusercontent.com/83824403/119154789-b4628a80-ba7c-11eb-9f9c-f201e8a93cb4.gif)



First thing, obtain information about the current Ubuntu Linux interface and IP address as we need this information later. Hence, type the following commands

 `$ nmcli con show`
 
` $nmcli connection show --active`


output


NAME  UUID                                  TYPE      DEVICE 
ETH0  71a189f2-9cb9-49f0-8464-37a6801740e3  ethernet  enp0s31f6


## Step 1 – Creating a network bridge named br0


The syntax is:

` $sudo nmcli con add ifname br0 type bridge con-name br0 `

` $ sudo nmcli con add type bridge-slave ifname enp0s31f6 master br0`

`$ nmcli connection show`

### Note: Disable or enable STP for network bridge


## Step 2 - Set up static or DHCP based IP for network bridge interface


We have not allocated any static IP address to our br0 interface. Hence, if the DHCP server is available, it should provide IP addresses and other settings. For instance, we can grab IP settings using DHCP as follows:


`$ sudo nmcli con up br0`

`$ ip a s br0`

`$ ping 192.168.1.26`


![185291316_1997103857098420_7487235751986220742_n](https://user-images.githubusercontent.com/83824403/119154625-88470980-ba7c-11eb-8d9b-1e61a40226dd.jpg)


Use the command $ 

`ping -I br1 10.1.0.11 `

to ping host2 and do the opposite 

## Step 3 – Enable br0 network bridge interface on Ubuntu Linux


So far, we configured required network settings. It is time to turn it on our br0:

`$sudo nmcli con up br0`

 `$ nmcli con show`


![183212210_320879066239921_5188923966750241948_n](https://user-images.githubusercontent.com/83824403/119150986-25a03e80-ba79-11eb-802a-54775b54875c.gif)


## Step 4 – Verification network bridge settings

Use the ip command to view the IP settings for br0 bridge on Ubuntu box:

`ip a s`

 `ip a s br0`

## Step 5 -Setup Tcpdump

Run a command:

`$ sudo apt-get install tcpdump`

and get
`$ sudo tcpdump -i enp0s3`


![183982181_479858563124658_7884193791281689746_n](https://user-images.githubusercontent.com/83824403/119150876-099c9d00-ba79-11eb-9483-ebc0234a0062.gif)

`$ sudo tcpdump -i any -c 10 -w vxlan.pcap`

## Step 6 - Setup Wireshark

Run a command

`$ sudo apt-get install wireshark`

 Start wireshark from Terminal:
 
`$ wireshark`


![195814017_174140674721101_8986612221412074170_n](https://user-images.githubusercontent.com/83824403/121567624-ff9f0600-ca48-11eb-98b3-e44a9966f821.jpg)




![194190768_551226359593587_1000465759930126226_n](https://user-images.githubusercontent.com/83824403/121389683-de6de500-c976-11eb-90e1-e59a6b6e6011.jpg)






# compare

 ## advantages
 
+ Increased scalability: In fact, VLAN only provides up to 4095 viable segments but VXLAN can reach 16 million with 24bit VNI.
+ Isolation & Security: VXLAN employs VNI to ensure the isolation of traffic. Each segment, definied by VNI, is an isolated environment, which expects to enhance the network traffic security.
+ Reduce packet transmission delay in VxLAN 
+ Hardware Support: Increasing become a standard. Supported by multiple modern switching devices
+ ...

## disadvantages

+ more complex; Appending a layer to system
+ Increase in Packet Size & Performance Reduction; increase in terms of bytes comes with more adding & removing operations to be executed on headers, which results in more workload for CPU
+ ...

# references

 Tham khảo
 

+  - http://costiser.ro/2016/07/07/overlay-tunneling-with-openvswitch-gre-vxlan-geneve-greoipsec/#.V8f_pKJquPW
+ - http://blog.scottlowe.org/2013/05/07/using-gre-tunnels-with-open-vswitch/
+ - https://www.cyberciti.biz/faq/ubuntu-20-04-add-network-bridge-br0-with-nmcli-command/?fbclid=IwAR2liN5uFh4gtuXGiGfnKADcyqSiB21P6pcKYZRn1ayNtKW77RBP5QhsilQ


