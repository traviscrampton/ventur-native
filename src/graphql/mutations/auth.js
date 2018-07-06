export const loginMutation = `
  mutation signIn($email: String!, $password: String!) {
    signIn(input: {email: $email, password: $password}) {
      errors
      token
      user {
        id
        fullName
      }
    }
  }
`
