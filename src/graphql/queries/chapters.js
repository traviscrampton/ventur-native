export const chapterQuery = `
    query chapter($id: ID) {
      chapter(id: $id) {
        id
        title
        description
        content
        bannerImageUrl
        dateCreated
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