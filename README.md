# Django Docker Base with Visualization of US Energy Consumption Application
This is the Django Docker Base for an interactive web portal for the Visualization of US Energy Consumption. The application will feature interactive Sankey diagram and stacked line graph from years 1800-2017.

## Running not using Docker Locally

`git clone` this repository.

cd `sankey`.

Create a virtual environment by running `virtualenv venv`.

### Activate the virtual environment by running:

on Linux/Mac: `source venv/bin/activate`
on Windows: `venv\Scripts\activate`


Install the necessary python packages by running `pip install -r requirements.txt`.

Run the migrations by running `./manage.py makemigrations` or `python manage.py makemigrations`.

Run the migrations by running `./manage.py migrate` or `python manage.py migrate`.

Start the web server by running `./manage.py runserver` or `python manage.py runserver`.

To see the website, go to `http://localhost:8000`.

  
## Some important javascript files:
  
* `us_energy_viz\static\us_energy_viz\js`  
  * `sankey_timeline.animation.*.js` attaches `d3.transition` 
    objects to relevant elements in the DOM. 
  * `sankey_timeline.chart.*.js` draws the elements
    that make up the Sankey diagram (flows, input and
    output boxes, labels, etc.).
  * `sankey_timeline.constants.*.js` contains variables with
    fixed values used throughout the code.
  * `sankey_timeline.data.*.js` contains the data being graphed.
  * `sankey_timeline.funcs.*.js` contains methods used for 
    calculating the geometry of the flows.
  * `sankey_timeline.summary.*.js` calculates summary information
    contained in the data that determines the geometry of the 
    graph.
    
## To change the Layout and Theme:

* `us_energy_viz\templates\us_energy_viz`    
    * Launch `index.html` to run the animation.
    
 - Change the Template pages as required to customize.
    
   