echo '--------------------------------------------------------------------'
echo '						     			  '
echo 'VI. Phase Six'
echo '						     			  '
echo '=============DEPLOYING TO-DO APPLICATION TO REMOTE HOST============='
echo '						     			  '
echo '						     			  '
echo '--------------------------------------------------------------------'
echo '						     '
#Run Ansible Playbooks
ansible-playbook -i $(pwd)/ansible/hosts $(pwd)/ansible/site.yml

#Clean `vm-host`
rm -rf  $(pwd)/* 

echo '---------------------------------------------'
echo '						     			  '
echo '						     			  '
echo '						     			  '
echo '=============DEPLOYMENT COMPLETED============='
echo '						     			  '
echo '						     			  '
echo '---------------------------------------------'
