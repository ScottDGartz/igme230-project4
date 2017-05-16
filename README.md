# Scott Gartz Project 4
My overall plan for the 3 different interactive graphics is to have each graphic build on the previous one and increase the functionality or complexity of what the previous one did. Almost as a way to show it going from a conceptual stage to a more complex, finished product.
## Item #1
My initial plan was to create a field, where there are various shapes floating around slowly, sort of just existing. They aren't necessarily following any sort of pattern or path. However, when a user clicks on the screen I want the shapes to all start convering on that point. I could have different shapes have different movement patterns(Speed, path ie. straight vs zig zag)
## Item #2
My next plan was to take what I had from the first one, and now have object's reacting differently to the mouse. If the mouse if just hovering without clicking, I would give the objects a steering force pulling the objects slowly towards the mouse. If the user were to click, it would drop a node object, which the objects would know to pathfollow on any nodes. So if I user clicked 4 times they would have created a path for the objects to follow. As soon as one object reaches a node, I would delete the node.
## Item #3
I would then take what I had from the second item, and possibly create some sort of UI, stating how many nodes exist, how many objects exist, etc.  My plan now would be to have a check on click, if it was on the background or on an object. If it was on an object I would want to create some sort of visual effect, like lines shooting out of fireworks? Something along those lines. And then I would have the same thing happen to whatever object hits the node. I would then make a check for if the mouse is being held down, and if the mouse is, I would have it begin to create new objects.


## Things I need to learn
I would need to work on my javascript to manipulate all of these elements. My knowledge from IGME 202 will help me a lot with the steering behaviors I plan to implement. I will probably end up referencing stackoverflow when I need to, but also possibly other resources to brush up on the IGME-202 knowledge, such as my old notes or old work from that course.

# Final Project Info

## Item #1
For the first illustration, we have a black canvas, a pink circle and a blue square. The two shapes are constantly seeking the middle of the canvas. However, when you click somehwere on the canvas, the target for the two shapes changes, so they now seek that new point. The circle bounces off of the side of the canvas, but the square wraps around to the other side of the canvas.
## Item #2
For the second illustration, we again have a black canvas. This time there are a bunch of randomly coloured squares and circles floating around, with triangle "stars" flying in the background. The squares still wrap to the other side, the circles bounce, and the triangles also wrap. However, now, the circles follow where the mouse moves to. The squares to the same thing, until you click. Upon clicking, a node is placed down, and the squares seek the node. If there are multiple nodes, the squares path follow through those nodes one after another.
## Item #3
For the third illustration, we still have the black canvas. This time the triangles are properly in the background, whereas for illustration 2, they were clipping with the squares and circles. This time there are no objects at the start. When you click, a node is placed. If you click on the node that is placed, it will delete that node. When you press and hold the mouse button, a square or circle will be spawned once every 100ms. The squares path follow the nodes, and correctly account for if a node is deleted.
There is also music playing in the background, and a counter in the top left corner for how many Objects and Nodes are in the scene
## Menu Screen
There are 4 buttons on the menu screen. Each button resizes based on the window size, and the text in it also resizes. The canvas is fit to the screen width. There are stars in the background. Each button uses javascript with clicking in canvas to link to one of the 3 illustrations, or to the documentation page. 