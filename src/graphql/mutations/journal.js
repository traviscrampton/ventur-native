export const journalCreate = `
    mutation CreateJournal($title: String!, $description: String!, $stage: String!, $status: String!, $bannerImage: String! ){
          CreateJournal(title: $title, description: $description, stage: $stage, status: $status, bannerImage: $bannerImage) {
            id
            title
            description
            stage
            status
        }
    }
`
