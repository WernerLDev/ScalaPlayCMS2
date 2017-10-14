
# Code generated schema

# --- !Ups

ALTER TABLE documents MODIFY COLUMN id INT NOT NULL auto_increment ;
ALTER TABLE editables ADD CONSTRAINT editables_documents_FK FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE ON UPDATE CASCADE ;
ALTER TABLE resettokens ADD CONSTRAINT resettokens_users_FK FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE ;


# --- !Downs

ALTER TABLE documents MODIFY COLUMN id BIGINT NOT NULL auto_increment ;
ALTER TABLE editables DROP FOREIGN KEY editables_documents_FK ;
ALTER TABLE resettokens DROP FOREIGN KEY resettokens_users_FK ;
