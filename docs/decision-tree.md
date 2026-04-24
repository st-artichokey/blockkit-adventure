# Decision Tree — The Lost Deploy

```
friday_alert ─── "The Friday Alert"
├── [button primary] check_logs ─── "Into the Logs"
│   ├── [button danger + confirm] hotfix_null ─── "The Hotfix"
│   │   ├── [button primary] emergency_review ─── "Emergency Review"
│   │   │   ├── [button primary] postmortem_tonight ─── "The Friday Night Post-Mortem" [FORM INPUT]
│   │   │   │   ├── [plain_text_input modal] postmortem_complete ─── "Post-Mortem Published" [END :trophy:]
│   │   │   │   └── [button] postmortem_skipped ─── "No Post-Mortem" [END :wastebasket:]
│   │   │   └── [button] monitor_and_go ─── "Set It and Forget It" [END :star2:]
│   │   └── [button danger + confirm] force_push ─── "YOLO Push" [END :cowboy_hat_face:]
│   ├── [button primary] rollback_smart ─── "Strategic Rollback"
│   │   ├── [button primary] postmortem_tonight ─── (see above) [FORM INPUT]
│   │   └── [button] monitor_and_go ─── "Set It and Forget It" [END :star2:]
│   └── [button] page_author ─── "Paging the Author"
│       ├── [button primary] mentor_fix ─── "Pair Programming Under Pressure" [FORM INPUT]
│       │   ├── [plain_text_input modal] mentor_fix_complete ─── "The Encouraging DM" [END :raised_hands:]
│       │   └── [button] mentor_fix_quick ─── "Quick Thanks" [END :wave:]
│       └── [button] rollback_smart ─── (see above)
├── [button danger + confirm] rollback_blind ─── "Blind Rollback"
│   ├── [button primary] check_logs ─── (see above)
│   └── [button danger + confirm] roll_forward_chaos ─── "Double Trouble" [END :fire_engine:]
└── [button] ignore_alert ─── "Not My Problem" [END :see_no_evil:]
```

### Legend

| Annotation | Block Kit Element |
|------------|-------------------|
| `button` | [Button element](https://docs.slack.dev/reference/block-kit/block-elements/button-element) (unstyled) |
| `button primary` | Button with `"style": "primary"` (green — investigate) |
| `button danger + confirm` | Button with `"style": "danger"` + [confirmation dialog](https://docs.slack.dev/reference/block-kit/composition-objects/confirmation-dialog-object) |
| `plain_text_input modal` | [Plain text input](https://docs.slack.dev/reference/block-kit/block-elements/plain-text-input-element) inside a [modal](https://docs.slack.dev/reference/views) via `view_submission` |

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
