export const journalCreate = `
    mutation CreateJournal($title: String!, $description: String!, $stage: String!, $status: String!, $cardImageUrl: String! ){
          CreateJournal(title: $title, description: $description, stage: $stage, status: $status, cardImageUrl: $cardImageUrl) {
            id
            title
            description
            stage
            status
        }
    }
`
