from xml.etree import cElementTree as ET

def find_tags(string):
	xmlstr = open('Tags.xml').read()
	tags=list()
	root = ET.fromstring(xmlstr)
	for row in list(root):
		tags.append(row.get('TagName'))
	results=list()
	for word in set(tags).intersection(string.split()):
		results.append(word)
	return results
