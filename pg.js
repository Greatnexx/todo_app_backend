// docker run --hostname=b75f3dd8b5b6 --env=POSTGRES_DB=to_do --env=PORT=4000 --env=DATABASE_URL= --env=NODE_ENV=development --env=POSTGRES_USER=user --env=POSTGRES_PASSWORD=user --env=PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/lib/postgresql/17/bin --env=GOSU_VERSION=1.17 --env=LANG=en_US.utf8 --env=PG_MAJOR=17 --env=PG_VERSION=17.2-1.pgdg120+1 --env=PGDATA=/var/lib/postgresql/data --volume=/var/lib/postgresql/data --network=full_stacktodo_app_default --workdir=/ -p 5432:5432 --restart=always --label='com.docker.compose.config-hash=5f105c88dbf00bc1b4dffeb4fefeffceffe543fc0f5374e0831fe3187b6c8978' --label='com.docker.compose.container-number=1' --label='com.docker.compose.depends_on=' --label='com.docker.compose.image=sha256:80cbdc6c330118a0a7e082e65be9f54d0d633280aec435a18ad0636095239ad5' --label='com.docker.compose.oneoff=False' --label='com.docker.compose.project=full_stacktodo_app' --label='com.docker.compose.project.config_files=C:\Users\user\Desktop\full_stack todo_app\docker-compose.yml' --label='com.docker.compose.project.working_dir=C:\Users\user\Desktop\full_stack todo_app' --label='com.docker.compose.replace=c139fd4f8c5da3b0624d6bc498968646c42576782bc7cc4ea263f76a6dacb366' --label='com.docker.compose.service=db' --label='com.docker.compose.version=2.29.2' --runtime=runc -d postgres