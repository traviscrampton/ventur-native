export const chapterQuery = `
    query chapter($id: ID) {
      chapter(id: $id) {
        id
        title
        description
        content
        bannerImageUrl
        readableDate
        date
        published
        offline
        distance
        emailSent
        user {
          id
          fullName
        }
        journal {
          id
          title
          miniBannerImageUrl
        }
      }
    }
`
