# Manual API Checks

```bash
curl http://localhost:5000/api/roles
curl -X POST http://localhost:5000/api/ai/suggestions \
  -H "Content-Type: application/json" \
  -d "{\"role\":\"Software Engineer\",\"section\":\"experience\",\"context\":{\"yearsOfExperience\":3,\"industry\":\"Tech\"}}"
```
