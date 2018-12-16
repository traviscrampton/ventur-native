export const userQuery = `
    query user($id: ID) {
      user(id: $id) {
        id
        firstName
        avatarImageUrl
        journals {
          id
          title
          status
          distance
          miniBannerImageUrl
        }
        gearItems {
          id
          title
          productImageUrl
        }
      }
    }
`
