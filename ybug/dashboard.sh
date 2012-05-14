DATE=`date +%m/%d`
#p1/p2 fixed
STAT1=`ybug s ybug-1week --priority "P1|P2" --bug_status "VERIFIED|RESOLVED" | wc -l`
#p1/p2 defects
STAT2=`ybug s --product Lego --component Photos --priority "P1|P2" --bug_status "NEW|REOPENED|ACCEPTED" --bugtype "DEFECT" | wc -l`
#p3+ fixed
STAT3=`ybug s ybug-1week --priority "P3|P4|P5" --bug_status "VERIFIED|RESOLVED" | wc -l`
#p3+ defects
STAT4=`ybug s --product Lego --component Photos --priority "P3|P4|P5" --bug_status "NEW|REOPENED|ACCEPTED" --bugtype "DEFECT" | wc -l`
#patches fixed
STAT5=`ybug s photo-7day-patch-verified | wc -l`
#patches 
STAT6=`ybug s photo-patch | wc -l`

echo " | Date | p2 closed | p2 defects | p3+ closed | p3+ defects | patch closed | patch total |"
echo "| $DATE | $STAT1 | $STAT2 | $STAT3 | $STAT4 | $STAT5 | $STAT6 |"
