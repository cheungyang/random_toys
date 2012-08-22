FLAG=`cat /websites/prod.mallocworks.com/ci/artifacts/herokuToys/pushflag`
if [ $FLAG = "1" ]; then
    `make -C /websites/prod.mallocworks.com/ci/builds/herokuToys int.push;`
    `echo "0">/websites/prod.mallocworks.com/ci/artifacts/herokuToys/pushflag`
    echo `date` "- DONE with int pushing" 
    `make -C /websites/prod.mallocworks.com/ci/builds/herokuToys-smoke/herokuToys smoke.sha.commit`
    echo `date` "- DONE with committing a smoke at int" 
fi
