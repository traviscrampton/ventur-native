import { SINGLE_JOURNAL_LOADED, SWITCH_JOURNAL_TAB } from "actions/action_types"

const defaultJournalData = {
	journal: {
		user: {},
	},
	chapters: [],
	gearItems: [],
	selectedTabFlag: "chapters",
	tabs: [{ flag: "chapters", title: "Chapters" }, { flag: "gearItems", title: "Gear" }, { flag: "map", title: "Map" }]
}

export default (state = defaultJournalData, action) => {
	switch (action.type) {
		case SINGLE_JOURNAL_LOADED:
			return {
				...state,
				journal: action.payload
			}
		case SWITCH_JOURNAL_TAB:
			let { selectedTabFlag } = action.payload
			return {
				...state,
				[selectedTabFlag]: action.payload[selectedTabFlag],
				selectedTabFlag: selectedTabFlag
			}
		default:
			return state
	}
}
