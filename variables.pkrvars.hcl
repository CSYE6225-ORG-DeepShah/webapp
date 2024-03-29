aws_regions = "us-east-1"
ami_regions = ["us-east-1"]
ami_description = "AMI for CSYE 6225"
ami_devaccount = "859694155826"
ami_demoaccount = "221741539694"
ami_name = "csye6225_"
delay_seconds = 120
max_attempts = 50
instance_type = "t2.micro"
source_ami = "ami-06db4d78cb1d3bbf9"
ssh_username = "admin"
device_name = "/dev/xvda"
volume_size = 25
volume_type = "gp2"
script_path = "script.sh"
zip_file_src = "webapp.zip"
zip_file_dest = "/home/admin/webapp.zip"
csv_file_src = "users.csv"
csv_file_dest = "/home/admin/users.csv"
service_file_src = "csye6225.service"
service_file_dest = "/home/admin/csye6225.service"
cloudWatch_file_src = "amazon-cloudwatch-agent.json"
cloudWatch_file_dest = "/home/admin/amazon-cloudwatch-agent.json"
#
#