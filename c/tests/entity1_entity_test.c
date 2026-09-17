// Generated instance test for the entity1 entity.

#include "ctest.h"

int main(void) {
  ObsidianSDK* sdk = test_sdk(NULL, NULL);
  CHECK(sdk != NULL, "sdk constructed");

  Entity* e = obsidian_entity1(sdk, NULL);
  CHECK(e != NULL, "entity instance");
  CHECK_STR_EQ(e->vt->get_name(e), "entity1", "entity get_name");

  TEST_SUMMARY("entity1_entity");
}
