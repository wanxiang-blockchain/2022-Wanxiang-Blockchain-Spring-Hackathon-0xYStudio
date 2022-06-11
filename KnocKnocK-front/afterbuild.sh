mv build/index.html build/index.bak 
sed  's/<title>React App<\/title>/<title>TurtleCase<\/title>/' build/index.bak > build/index.html 
rm -rf build/index.bak 
mv build/static /Users/zhanglun/PycharmProjects/dongdu/ 
mv build/index.html /Users/zhanglun/PycharmProjects/dongdu/templates/ 
mv build/* /Users/zhanglun/PycharmProjects/dongdu/static/media/
