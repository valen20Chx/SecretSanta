# Tables
|Participant|
|-|
|Id|
|Name|
|Email|
|Date Joined|

|Association|
|-|
|Id|
|GifterId|
|ReceiverId|
|Date Created|

|List|
|-|
|Id|
|Date|

# Relations
```mermaid
graph LR
A[Participant]
B[Association];
C[List];

B --> A --> C;
```