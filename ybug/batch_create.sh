clear
echo "=============================="
echo "= Lets create A LOT of bugs! ="
echo "=============================="
echo ""
echo -n "product (Lego):"
read sprod
if [ -z $sprod ]; then
  sprod="Lego"
fi
echo -n "component (Photos):"
read scomp
if [ -z $scomp ]; then
  scomp="Photos"
fi
echo -n "target_milestone (Photo 2012-07-25):"
read smile
if [ ! $smile ]; then
  smile="Photo 2012-07-25"
fi
echo -n "bugtype (Task):"
read stype
if [ -z $stype ]; then
  stype="Task"
fi
echo -n "priority (P3):"
read sprior
if [ -z $sprior ]; then
  sprior="P3"
fi

icount=1
echo ""
echo "------bug #$icount------"
echo -n "title (empty to quit):"
read stitle
while [[ $stitle ]]; do
    echo -n "description (as titled):"
    read sdesc
    if [[ ! $sdesc ]]; then
        sdesc="as titled"
    fi
    echo -n "assignee byID (ycheung):"
    read sbyid
    if [ -z $sbyid ]; then
        sbyid="ycheung"
    fi

    echo ""
    echo -n ">>>>creating.............."
    echo ""
    ybug create --product=$sprod --component=$scomp --bugtype=$stype --target_milestone="$smile" --priority=$sprior --short_desc="$stitle" --comment="$sdesc" --assigned_to=$sbyid@yahoo-inc.com

    icount=$((icount+1))
    echo ""
    echo "------bug #$icount------"
    echo -n "title (empty to quit)"
    read stitle
done

echo ""
echo "that's it?  I am so disappointed!"
