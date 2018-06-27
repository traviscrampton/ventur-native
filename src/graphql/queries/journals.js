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
			fullName
			avatarImageUrl
		}
	}
}`

export const singleJournalQuery = (id) => { return `
	query {
  		journal(id: ${id}) {
    		id
		    title
		    description
		    cardImageUrl
		    status
		    distance
    		user {
		      id
		      fullName
		      avatarImageUrl
		    }
		    chapters {
		      id
		      title
		      dateCreated
		      description
		      imageUrl
		      distance
		    }
		  }
	}	
`
}