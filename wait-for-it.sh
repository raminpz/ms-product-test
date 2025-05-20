#!/usr/bin/env bash
#  Use this script to test if a given TCP host/port are available

set -e

host="$1"
port="$2"
shift 2
cmd="$@"

echo "Waiting for $host:$port..."

until nc -z "$host" "$port"; do
  >&2 echo "Service $host:$port is unavailable - sleeping"
  sleep 2
done

>&2 echo "Service $host:$port is up - executing command"
exec $cmd
