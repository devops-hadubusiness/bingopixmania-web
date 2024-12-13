#!/bin/bash

AMAZON_S3_BUCKET="s3://descomplizap.com.br"
AMAZON_CLOUDFRONT_DISTRIBUTION_ID="E1XZ451Y90FSEG"

upload_s3(){
  sudo rm -rf dist;
  sudo yarn;
  sudo chmod -R 755 .;
  sudo chown -R $USER:$USER .;
  sudo yarn build;
  # sudo cp -R src/public/* dist/public;
	echo "Emptying S3 target bucket ...";
  aws s3 rm ${AMAZON_S3_BUCKET} --recursive --profile descomplizap;
	echo "Bucket emptied !";
	echo "Uploading files to S3 ...";
  aws s3 cp "dist" ${AMAZON_S3_BUCKET} --recursive --profile descomplizap;
	echo "Upload completed !";
	echo "Reseting CloudFront cache ...";
  aws cloudfront create-invalidation --distribution-id ${AMAZON_CLOUDFRONT_DISTRIBUTION_ID} --paths "/*" --profile descomplizap;
  sudo chmod -R 755 .;
  sudo chown -R $USER:$USER .;
}

read -p "Confirm deploy to PROD staging ? Remember to check environment variables. Choose: (y/n) " choice
case "$choice" in
  y|Y|yes|Yes|s|S|Sim|sim ) upload_s3;;
  n|N|no|No|not|Not|não|Não|* ) echo "Deploy cancelled";;
esac