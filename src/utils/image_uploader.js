import { RNS3 } from "react-native-aws3"

// const file = {
//   // `uri` can also be a file system path (i.e. file://)
//   uri: "assets-library://asset/asset.PNG?id=655DBE66-8008-459C-9358-914E1FB532DD&ext=PNG",
//   name: "image.png",
//   type: "image/png"
// }

let options = {
  keyPrefix: "s3/",
  bucket: "ventur-blog",
  region: 'us-west-1',
  successActionStatus: 201
}

export const awsUpload = async (file, awsKeys) => {
  options = Object.assign({}, options, awsKeys)
  console.log("OPTIONS", options)
  const response = await RNS3.put(file, options)
  return response
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
}
