# Decision Tree — The Lost Deploy

```
friday_alert ─── "The Friday Alert"
├── check_logs ─── "Into the Logs"
│   ├── hotfix_null ─── "The Hotfix"
│   │   ├── emergency_review ─── "Emergency Review"
│   │   │   ├── postmortem_tonight ─── "The Friday Night Post-Mortem" [FORM INPUT]
│   │   │   │   ├── [form] postmortem_complete ─── "Post-Mortem Published" [END :trophy:]
│   │   │   │   └── [skip] postmortem_skipped ─── "No Post-Mortem" [END :wastebasket:]
│   │   │   └── monitor_and_go ─── "Set It and Forget It" [END :star2:]
│   │   └── force_push ─── "YOLO Push" [END :cowboy_hat_face:]
│   ├── rollback_smart ─── "Strategic Rollback"
│   │   ├── postmortem_tonight ─── (see above) [FORM INPUT]
│   │   └── monitor_and_go ─── "Set It and Forget It" [END :star2:]
│   └── page_author ─── "Paging the Author"
│       ├── mentor_fix ─── "Pair Programming Under Pressure" [FORM INPUT]
│       │   ├── [form] mentor_fix_complete ─── "The Encouraging DM" [END :raised_hands:]
│       │   └── [skip] mentor_fix_quick ─── "Quick Thanks" [END :wave:]
│       └── rollback_smart ─── (see above)
├── rollback_blind ─── "Blind Rollback"
│   ├── check_logs ─── (see above)
│   └── roll_forward_chaos ─── "Double Trouble" [END :fire_engine:]
└── ignore_alert ─── "Not My Problem" [END :see_no_evil:]
```

## Endings (8)

| Node | Title | Emoji | Shortest Path |
|------|-------|-------|---------------|
| `postmortem_complete` | Post-Mortem Published | :trophy: | 4 steps |
| `postmortem_skipped` | No Post-Mortem | :wastebasket: | 4 steps |
| `monitor_and_go` | Set It and Forget It | :star2: | 3 steps |
| `force_push` | YOLO Push | :cowboy_hat_face: | 3 steps |
| `mentor_fix_complete` | The Encouraging DM | :raised_hands: | 4 steps |
| `mentor_fix_quick` | Quick Thanks | :wave: | 4 steps |
| `roll_forward_chaos` | Double Trouble | :fire_engine: | 3 steps |
| `ignore_alert` | Not My Problem | :see_no_evil: | 2 steps |

## Form Input Nodes (2)

| Node | Input | Block Kit Demo |
|------|-------|----------------|
| `postmortem_tonight` | Post-mortem title | Mixed actions (form + skip button), enriched modal (header, flavor, hint), emoji in placeholder |
| `mentor_fix` | Message to Alex | Second form input path, different modal flavor text, emoji in user message |
