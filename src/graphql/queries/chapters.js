export const chapterQuery = `
    query chapter($id: ID) {
      chapter(id: $id) {
        id
        title
        description
        content
        bannerImageUrl
        dateCreated
        offline
        distance
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
