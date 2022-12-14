from sklearn.cluster import KMeans

def groupStudents(students, routes):
    if (len(students) < len(routes)):
        retDict = {};
        for index, student in enumerate(students):
            retDict[student["id"]] = routes[index]
        return retDict

    kmeans = KMeans(len(routes))
    preppedListWIds = []
    preppedListWithoutIds = []
    for student in students:
        preppedListWIds.append([student['lng'], student['lat'], student['id']])
        preppedListWithoutIds.append([student['lng'], student['lat']])
    identified_clusters = kmeans.fit_predict(preppedListWithoutIds)
    retDict = {};
    for index, student in enumerate(preppedListWIds):
        retDict[student[2]] = routes[identified_clusters[index]]
    return retDict