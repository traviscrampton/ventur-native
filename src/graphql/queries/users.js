export const userQuery = `
    query user($id: ID) {
      user(id: $id) {
        id
        fullName
        avatarImageUrl
        journals {
          id
          title
          status
          distance
          miniBannerImageUrl
        }
      }
    }
`
