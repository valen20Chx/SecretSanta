# Tables

## Association
|Columns|Types|
|-|-|
|**id**|serial|
|*gifter_id*|serial|
|*receiver_id*|serial|
|date_created|date|

## Participant
|Columns|Types|
|-|-|
|**id**|serial|
|name|text|
|email|text|
|date_added|date|
|creator|boolean|
|*list_id*|serial|

## list
|Columns|Types|
|-|-|
|**id**|serial|
|date_created|date|
|scrambled|boolean|
|max_participants|integer|

# Relations
```mermaid
graph LR
A[Participant]
B[Association];
C[List];

B --> A --> C;
```