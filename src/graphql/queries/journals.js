export const allJournalsQuery = `
    query {
    	allJournals {
		id
		slug
		title
		description
		cardImageUrl
		status
		distance
		user {
			id
			firstName
			lastName
			avatarImageUrl
		}
	}
}`