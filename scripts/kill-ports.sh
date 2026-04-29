#!/usr/bin/env bash
# Kill all processes listening on ports 3000–3020

START_PORT=3000
END_PORT=3020

killed=0

for port in $(seq "$START_PORT" "$END_PORT"); do
  if command -v lsof &>/dev/null; then
    # macOS / Linux / Git Bash with lsof
    pids=$(lsof -ti tcp:"$port" 2>/dev/null)
  else
    # Windows fallback via netstat + awk
    pids=$(netstat -ano 2>/dev/null \
      | tr -d '\r' \
      | awk -v p=":$port" '$2 ~ (p "$") && $4 == "LISTENING" { print $5 }' \
      | sort -u)
  fi

  for pid in $pids; do
    if kill -9 "$pid" 2>/dev/null; then
      echo "Killed PID $pid on port $port"
      ((killed++))
    else
      # Fallback for Windows where kill may not work
      if taskkill //F //PID "$pid" &>/dev/null; then
        echo "Killed PID $pid on port $port (taskkill)"
        ((killed++))
      fi
    fi
  done
done

if [[ $killed -eq 0 ]]; then
  echo "No processes found on ports $START_PORT–$END_PORT"
else
  echo "Done — killed $killed process(es)"
fi
