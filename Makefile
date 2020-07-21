DEPLOY=		public
COMMON= 	scripts/yasb.py templates/base.tmpl $(wildcard static/yaml/*.yaml)
RSYNC_FLAGS= 	-rv --copy-links --progress --exclude="*.swp" --exclude="*.yaml" --size-only
YAML=		$(shell ls pages/*.yaml)
HTML= 		${YAML:.yaml=.html}

%.html:		%.yaml ${COMMON}
	./scripts/yasb.py $< > $@

all:		${HTML}

install:	mirror

deploy:	all
	mkdir -p ${DEPLOY}/static
	cp -frv pages/*.html		${DEPLOY}/.
	cp -frv static/*		${DEPLOY}/static/.
	cp -frv static/ico/favicon.ico	${DEPLOY}/.

mirror:	deploy
	lftp -c "open www3ftps.nd.edu; mirror -c -e -R -L public www/teaching/cse.30341.fa20"

clean:
	rm -f ${HTML}
