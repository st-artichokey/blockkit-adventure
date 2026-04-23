# Decision Tree — The Lost Deploy

```
friday_alert ─── "The Friday Alert"
├── check_logs ─── "Into the Logs"
│   ├── hotfix_null ─── "The Hotfix"
│   │   ├── emergency_review ─── "Emergency Review"
│   │   │   ├── postmortem_tonight ─── "The Friday Night Post-Mortem" [END :trophy:]
│   │   │   └── monitor_and_go ─── "Set It and Forget It" [END :star2:]
│   │   └── force_push ─── "YOLO Push" [END :cowboy_hat_face:]
│   ├── rollback_smart ─── "Strategic Rollback"
│   │   ├── postmortem_tonight ─── "The Friday Night Post-Mortem" [END :trophy:]
│   │   └── monitor_and_go ─── "Set It and Forget It" [END :star2:]
│   └── page_author ─── "Paging the Author"
│       ├── mentor_fix ─── "Pair Programming Under Pressure" [END :raised_hands:]
│       └── rollback_smart ─── (see above)
├── rollback_blind ─── "Blind Rollback"
│   ├── check_logs ─── (see above)
│   └── roll_forward_chaos ─── "Double Trouble" [END :fire_engine:]
└── ignore_alert ─── "Not My Problem" [END :see_no_evil:]
```

## Endings (6)

| Node | Title | Emoji | Shortest Path |
|------|-------|-------|---------------|
| `postmortem_tonight` | The Friday Night Post-Mortem | :trophy: | 3 steps |
| `monitor_and_go` | Set It and Forget It | :star2: | 3 steps |
| `force_push` | YOLO Push | :cowboy_hat_face: | 3 steps |
| `mentor_fix` | Pair Programming Under Pressure | :raised_hands: | 3 steps |
| `roll_forward_chaos` | Double Trouble | :fire_engine: | 3 steps |
| `ignore_alert` | Not My Problem | :see_no_evil: | 2 steps |
