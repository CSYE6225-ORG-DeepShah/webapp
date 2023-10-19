packer {
  required_plugins {
    amazon = {
      version = ">= 1.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "MY_PASSWORD" {
  type    = string
  default = "${env("PASSWORD")}"
}

variable "MY_DATABASE" {
  type    = string
  default = "${env("DATABASE")}"
}

variable "aws_regions" {
  type    = string
  default = null
}

variable "ami_regions" {
  type    = list(string)
  default = null
}


variable "source_ami" {
  type    = string
  default = null # Debian 12 ARM(Mac Chip)
}

variable "ssh_username" {
  type    = string
  default = null
}

variable "ami_description" {
  type    = string
  default = null
}

variable "ami_devaccount" {
  type    = string
  default = null
}

variable "ami_demoaccount" {
  type    = string
  default = null
}

variable "ami_name" {
  type    = string
  default = null
}

variable "delay_seconds" {
  type    = number
  default = null
}

variable "max_attempts" {
  type    = number
  default = null
}

variable "instance_type" {
  type    = string
  default = null
}

variable "device_name" {
  type    = string
  default = null
}

variable "volume_size" {
  type    = number
  default = null
}

variable "volume_type" {
  type    = string
  default = null
}


variable "script_path" {
  type    = string
  default = null
}

variable "zip_file_src" {
  type    = string
  default = null
}

variable "zip_file_dest" {
  type    = string
  default = null
}

variable "csv_file_src" {
  type    = string
  default = null
}

variable "csv_file_dest" {
  type    = string
  default = null
}


source "amazon-ebs" "my-ami-debian12" {
  region          = "${var.aws_regions}"
  ami_name        = "${var.ami_name}${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = "${var.ami_description}"
  ami_users       = ["${var.ami_devaccount}", "${var.ami_demoaccount}"]
  ami_regions =  "${var.ami_regions}"


  aws_polling {
    delay_seconds = "${var.delay_seconds}"
    max_attempts  = "${var.max_attempts}"
  }

  instance_type = "${var.instance_type}"
  source_ami    = "${var.source_ami}"
  ssh_username  = "${var.ssh_username}"

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "${var.device_name}"
    volume_size           = "${var.volume_size}"
    volume_type           = "${var.volume_type}"
  }
}

build {
  sources = [
    "source.amazon-ebs.my-ami-debian12"
  ]

  provisioner "file" {
    source      = "${var.zip_file_src}"
    destination = "${var.zip_file_dest}"
  }

  provisioner "file" {
    source      = "${var.csv_file_src}"
    destination = "${var.csv_file_dest}"
  }

  provisioner "shell" {
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "CHECKPOINT_DISABLE=1",
      "MY_DATABASE=${var.MY_DATABASE}",
      "MY_PASSWORD=${var.MY_PASSWORD}"
    ]
    script = "${var.script_path}"
  }
}