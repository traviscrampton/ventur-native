import { RNS3 } from 'react-native-aws3';
// const AWS = require("aws-sdk/dist/aws-sdk-react-native")

const cloudFrontUrl = 'd2965tkwq0s5g3.cloudfront.net';
export const cloudFrontUrlLength = `https://${cloudFrontUrl}`.length;

let options = {
  bucket: 'ventur-serverless',
  region: 'us-east-1',
  successActionStatus: 201
};

export const deleteS3Objects = async (imageUrls, awsKeys) => {
  // let deleteParam = {
  //   Bucket: "ventur-serverless",
  //   Delete: {
  //     Objects: imageUrls.map((url, i) => {
  //       return Object.assign({}, { Key: url.substring(cloudFrontUrlLength + 1) })
  //     })
  //   }
  // }
  // const s3 = new AWS.S3({
  //   region: "us-east-1",
  //   secretAccessKey: awsKeys.awsSecretKey,
  //   accessKeyId: awsKeys.awsAccessKey
  // })
  // s3.deleteObjects(deleteParam, function(err, data) {
  //   if (err) console.log("errord oot", err, err.stack)
  //   else console.log("delete", data)
  // })
};

export const awsUpload = async (file, awsKeys) => {
  options = { ...options, awsKeys };
  const response = await RNS3.put(file, options);
  let url = response.body.postResponse.location;
  url = url.replace('ventur-serverless.s3.amazonaws.com', cloudFrontUrl);
  return url;
  // RNS3.put(file, options).then(response => {
  //   console.log("does any of this fucking work")
  //   // if (response.status !== 201) {
  //   //   console.log("we got an error", response.body)
  //   //   throw new Error("Failed to upload image to S3")
  //   // }

  //   // return response
  //   *
  //    * {
  //    *   postResponse: {
  //    *     bucket: "your-bucket",
  //    *     etag : "9f620878e06d28774406017480a59fd4",
  //    *     key: "uploads/image.png",
  //    *     location: "https://your-bucket.s3.amazonaws.com/uploads%2Fimage.png"
  //    *   }
  //    * }

  // })
};
