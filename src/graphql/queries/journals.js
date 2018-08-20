export const allJournalsQuery = `
  query {
  	allJournals {
			id
			slug
			title
			description
			cardBannerImageUrl
			status
			distance
			user {
				id
				fullName
				avatarImageUrl
			}
		}
	}
`

export const myJournalsQuery = `
  query {
    myJournals {
      id
      title
      status
      distance
      miniBannerImageUrl
    }
  }
`

export const journalQuery = `
    query journal($id: ID) {
      journal(id: $id) {
    		id
		    title
		    description
		    cardBannerImageUrl
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

export const journalChaptersQuery = `
	query journal($id: ID) {
		journal(id: $id) {
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

export const journalGearItems = `
	query journal($id: ID) {
		journal(id: $id) {
	    gearItems {
	      id
	      productImageUrl
	      title
	    }
	  }
	}
`

