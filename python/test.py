thislist = ["apple", "banana", "cherry", "orange", "kiwi", "mango"]
# thislist.append("pineapple")
# thislist.insert(1,"jackfruit")
# for x in thislist:
#     print(x)
# [print(x) for x in thislist]

# newlist = []

# for x in thislist:
#   if "a" in x:
#     newlist.append(x)

# print(newlist)
# print(thislist)

# thislist.sort(reverse = True)
# print(thislist)

# list1 = ["a", "b", "c"]
# list2 = [1, 2, 3]

# list3 = list1 + list2
# print(list3)

# thistuple = ("apple", "banana", "cherry")
# thistuple = tuple(("apple", "banana", "cherry"))
# print(len(thistuple))
# print(type(thistuple))


thistuple = ("apple", "banana", "cherry", "orange", "kiwi", "melon", "mango")
# print(thistuple[2:5])
# print(thistuple[1:3])

x = ("apple", "banana", "cherry")
print (x)
y = list(x)

y.append("jackfruit")
print(y)

a = 5
b = 6
c = 7

# Uncomment below to take inputs from the user
a = float(input('Enter first side: '))
b = float(input('Enter second side: '))
c = float(input('Enter third side: '))
d = float(input('Enter the fourth side'))

# calculate the semi-perimeter
s = (a + b + c) / 2

# calculate the area
area = (s*(s-a)*(s-b)*(s-c)) ** 0.5
print('The area of the triangle is %0.2f' %area)
