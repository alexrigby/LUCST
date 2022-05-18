# LUCST
## Land Use Change SWAT+ Toolkit
LUCST is an interface for managing SWATPlus input and output files to aid in implementing, and visualizing the impact of land use changes on catchment hydrology in the SWATPlus model (rev60.5.2_64rel.exe)

Video intro [here](https://youtu.be/QygBidYr4cQ)

![LUCST interface](https://github.com/alexrigby/LUCST/blob/master/images/LUCST%20interface.PNG)

Full help documentation available in the [documentation](https://github.com/alexrigby/LUCST/blob/master/documentation/LUCST%20walkthrough%20v1.2.pdf) folder

## Software Requirements
* Windows 10

* NPM >8.1.2

* NodeJS >14.15.4 

* Python 3.9.7 

## Basic Usage

### Input Data

As its input data, the toolkit requires:
* A properly calibrated SWAT+ catchment model
* The catchments associated shape files produced in QSWAT+

If you are not familiar with SWAT+ please visit the links bellow:
* [SWAT+ download](https://swatplus.gitbook.io/docs/installation)
* [A Useful short video series on getting started with SWAT+](https://youtu.be/dBARtcejaPM)
* [A useful SWAT+ calibration tool is SWAT+ Toolbox, download and documentation](celray.github.io/docs/swatplus_toolbox/introduction.html)

***IMPORTANT:** The accuracy of the toolkit’s outputs are fully reliant on the accuracy of the original
input SWAT+ model. To ensure an acceptable accuracy only properly calibrated catchments with an 
acceptable NSE (Nash Sutcliffe Efficiency) of 0.5 and above should be studied using the toolkit.* 

### Catchment Preperation

SWAT+ modelled catchment prep must be done correctly before any LULC change investigation: 
* Copy the SWAT+ catchment directory and SWAT+ model exe files to the LUCST directory
* Zip shape files
* Edit run times
* Edit print options and simulation runtime

### Set Up Servers



